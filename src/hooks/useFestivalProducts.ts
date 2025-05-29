
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/types';
import { toast } from '@/hooks/use-toast';

export const useFestivalProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Carregar produtos do Supabase
  const loadProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('festival_products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const mappedProducts: Product[] = data.map(p => ({
        id: p.id,
        name: p.name,
        price: Number(p.price),
        booth: p.booth,
        isActive: p.is_active,
        isFree: p.is_free
      }));

      setProducts(mappedProducts);
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar produtos",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Adicionar produto
  const addProduct = async (product: Omit<Product, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('festival_products')
        .insert({
          name: product.name,
          price: product.price,
          booth: product.booth,
          is_active: product.isActive,
          is_free: product.isFree || false
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Sucesso!",
        description: "Produto adicionado com sucesso"
      });

      return data;
    } catch (error) {
      console.error('Erro ao adicionar produto:', error);
      toast({
        title: "Erro",
        description: "Erro ao adicionar produto",
        variant: "destructive"
      });
      throw error;
    }
  };

  // Atualizar produto
  const updateProduct = async (id: string, updates: Partial<Product>) => {
    try {
      const updateData: any = {};
      if (updates.name !== undefined) updateData.name = updates.name;
      if (updates.price !== undefined) updateData.price = updates.price;
      if (updates.booth !== undefined) updateData.booth = updates.booth;
      if (updates.isActive !== undefined) updateData.is_active = updates.isActive;
      if (updates.isFree !== undefined) updateData.is_free = updates.isFree;

      const { error } = await supabase
        .from('festival_products')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Erro ao atualizar produto:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar produto",
        variant: "destructive"
      });
      throw error;
    }
  };

  // Deletar produto
  const deleteProduct = async (id: string) => {
    try {
      const { error } = await supabase
        .from('festival_products')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Erro ao deletar produto:', error);
      toast({
        title: "Erro",
        description: "Erro ao deletar produto",
        variant: "destructive"
      });
      throw error;
    }
  };

  // Configurar realtime
  useEffect(() => {
    loadProducts();

    const channel = supabase
      .channel('festival-products-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'festival_products' }, 
        () => {
          loadProducts();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    products,
    loading,
    addProduct,
    updateProduct,
    deleteProduct
  };
};
